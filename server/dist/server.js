import express from "express";
import { getScrapedRecipe, getErrorMessage } from "./functions.js";
const router = express.Router();
router.post("/recipe", async (req, res) => {
    try {
        console.log(req.body);
        const { url } = req.body;
        if (!url) {
            throw new Error("URL is required");
        }
        const data = await getScrapedRecipe(url);
        res.send(data);
    }
    catch (error) {
        console.error(error);
        res.status(400).send({ message: getErrorMessage(error) });
    }
});
export default router;
//# sourceMappingURL=server.js.map