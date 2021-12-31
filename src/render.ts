import { segment, template } from "koishi-core";
import path from "path";

import pug from "pug";

import { parseMacroDescriptionForHtml } from "./parser";

import { Puppeteer } from "koishi-plugin-puppeteer";

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
  const html = pug.renderFile(
    path.resolve(__dirname, "../view/macro.pug"),
    { name, description: parseMacroDescriptionForHtml(description) },
  );

  const page = await puppeteer.page();

  if (!page) {
    return template("macrodict.not_found_puppeteer");
  }

  try {
    await page.goto(`file:///${path.resolve(__dirname, "../view/index.html")}`);

    await page.setContent(html);

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
