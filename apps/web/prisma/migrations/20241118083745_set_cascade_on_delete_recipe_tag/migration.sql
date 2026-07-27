-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTag" DROP CONSTRAINT "RecipeTag_tagId_fkey";

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTag" ADD CONSTRAINT "RecipeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
