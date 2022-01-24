import { segment, template } from "koishi";
import path from "path";

import { parseMacroDescriptionForHtml } from "./parser";

import Puppeteer from "@koishijs/plugin-puppeteer";

/**
 * Render the macro definition text to HTML-based image.
 *
 * This function requires `koishi-plugin-puppeteer` plugin to be installed.
 */
export async function renderMacroView(
  puppeteer: Puppeteer,
  macro: { name: string; description: string },
): Promise<string> {
  let screenshot: Buffer;

  const { name, description } = macro;
  const descriptionHtml = parseMacroDescriptionForHtml(description);

  const page = await puppeteer.page();

  if (!page) {
    return template("macrodict.not_found_puppeteer");
  }

  try {
    await page.goto(`file:///${path.resolve(__dirname, "../view/macro.html")}`);

    const result = await page.evaluate((name, description) => {
      let el = document.getElementById("macro-name");
      if (!el) {
        return false;
      }
      el.innerText = name;
      el = document.getElementById("macro-description");
      if (!el) {
        return false;
      }
      el.innerHTML = description;
    }, name, descriptionHtml);

    if (result === false) {
      return template("macrodict.puppeteer_error");
    }

    // set the viewport to the same size as the page
    const { width, height } = await page.evaluate(() => {
      const ele = document.body;
      return {
        width: ele.scrollWidth,
        height: ele.scrollHeight,
      };
    });
    await page.setViewport({
      width,
      height,
    });

    // take a screenshot
    screenshot = await page.screenshot({
      fullPage: true,
      type: "png",
    });
  } catch (err) {
    await page.close();
    return template("macrodict.puppeteer_error", err);
  }

  // don't forget to close the page
  await page.close();
  return segment.image(screenshot);
}
