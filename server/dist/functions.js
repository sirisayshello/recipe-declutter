import he from "he";
import { chromium } from "playwright";
function findGraphObjectWithRecipeData(inputData) {
    const result = inputData.find((obj) => {
        return obj["@type"] === "Recipe";
    });
    return result;
}
//Function to generate array of recipeInstructions
function generateStringArray(recipeInstructions) {
    return recipeInstructions.map((instruction) => instruction.text);
}
// Function to decode ingredients and instructions
function decodeData(data) {
    return data.map((item) => he.decode(item));
}
// function to use in catch blocks
export function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
export const getScrapedRecipe = async (url) => {
    try {
        const browser = await chromium.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.goto(url);
        // Get all scripts of type "application/ld+json" from the provided url
        const jsonLdData = await page.evaluate(() => {
            const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
            const data = [];
            scriptTags.forEach((scriptTag) => {
                data.push(scriptTag.innerHTML);
            });
            return data;
        });
        await browser.close();
        let scriptWithRecipeData = "";
        // Find the correct json string
        jsonLdData.forEach((jsonString) => {
            if (jsonString.includes("recipeIngredient") &&
                jsonString.includes("recipeInstructions")) {
                scriptWithRecipeData = jsonString;
            }
        });
        if (!scriptWithRecipeData) {
            console.log("No application/ld+json scripts");
            throw new Error("The provided URL does not contain the necessary recipe data");
        }
        // Parse the correct json string
        const rawRecipeData = JSON.parse(scriptWithRecipeData);
        let recipeData;
        if ("@graph" in rawRecipeData) {
            const graph = rawRecipeData["@graph"];
            recipeData = findGraphObjectWithRecipeData(graph);
        }
        else if (Array.isArray(rawRecipeData)) {
            recipeData = findGraphObjectWithRecipeData(rawRecipeData);
        }
        else {
            recipeData = rawRecipeData;
        }
        if (!recipeData) {
            console.log("recipeData not found");
            throw new Error("The provided URL does not contain the necessary recipe data");
        }
        if (!recipeData.recipeIngredient) {
            console.log("Ingredients array not found");
            throw new Error("The provided URL does not contain the necessary recipe data");
        }
        const ingredientsData = recipeData.recipeIngredient;
        let instructionsArray = []; // Initialize as an array of any type
        let instructionsData = [];
        if (Array.isArray(recipeData.recipeInstructions) &&
            recipeData.recipeInstructions.length > 0) {
            instructionsArray = recipeData.recipeInstructions;
        }
        else {
            console.log("Instructions is either not an array, or it is empty");
            throw new Error("The provided URL does not contain the necessary recipe data");
        }
        // the array of instructions comes wither as an array of strings,
        // or as an object which should fall under "HowToStep" or "HowToSection" below
        // see https://developers.google.com/search/docs/appearance/structured-data/recipe#recipe-properties
        if (typeof instructionsArray[0] === "string") {
            instructionsData = instructionsArray;
        }
        else if (typeof instructionsArray[0] === "object" &&
            instructionsArray[0]["@type"] === "HowToSection") {
            instructionsArray.forEach((section) => {
                const items = generateStringArray(section.itemListElement);
                instructionsData.push(...items);
            });
        }
        else if (typeof instructionsArray[0] === "object" &&
            instructionsArray[0]["@type"] === "HowToStep") {
            instructionsData = generateStringArray(instructionsArray);
        }
        else {
            console.log("Instructions must be of either type objects or strings");
            throw new Error("The provided URL does not contain the necessary recipe data");
        }
        const decodedIngredients = decodeData(ingredientsData);
        const decodedInstructions = decodeData(instructionsData);
        return {
            ingredients: decodedIngredients,
            instructions: decodedInstructions,
        };
    }
    catch (error) {
        console.error(error);
        return { message: getErrorMessage(error) };
    }
};
//# sourceMappingURL=functions.js.map