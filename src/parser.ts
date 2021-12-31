/**
 * Parse a macro definition text for HTML.
 */
export function parseMacroDescriptionForHtml(description: string): string {
  return description
    .replace(
      // FFXIV use color code in macro description
      // to highlight the wrapped text with orange color.
      // So we need to replace the color code with span tag.
      // eslint-disable-next-line max-len
      /<UIForeground>F201FA<\/UIForeground><UIGlow>F201FB<\/UIGlow>(.*?)<UIGlow>01<\/UIGlow><UIForeground>01<\/UIForeground>/g,
      "<span class='highlight'>$1</span>",
    )
    // A weird character in Japanese macro description
    .replace(/\ue070/g, "→")
    .replace(/\n/g, "<br>")
    // The soft indent(?) in French / German macro description
    .replace(/<Indent\/>/g, " ")
    // remove soft hyphen that is used in deutschen makro
    .replace(/<SoftHyphen\/>/g, "");
}
