export interface CompletionSnippet {
  key: string;
  label: string;
  detail?: string;
  documentation?: string;
  snippet: string;
  sortOrder: string;
  filterText: string;
}

export const completionSnippets: ReadonlyArray<CompletionSnippet> = [
  {
    key: "heading1",
    label: "Heading 1",
    detail: "# text",
    documentation: "Insert an H1 heading",
    snippet: "# ${1:text}",
    sortOrder: "00",
    filterText: ";heading1"
  },
  {
    key: "heading2",
    label: "Heading 2",
    detail: "## text",
    documentation: "Insert an H2 heading",
    snippet: "## ${1:text}",
    sortOrder: "01",
    filterText: ";heading2"
  },
  {
    key: "heading3",
    label: "Heading 3",
    detail: "### text",
    documentation: "Insert an H3 heading",
    snippet: "### ${1:text}",
    sortOrder: "02",
    filterText: ";heading3"
  },
  {
    key: "bold",
    label: "Bold",
    detail: "**text**",
    documentation: "Insert bold text",
    snippet: "**${1:text}**",
    sortOrder: "03",
    filterText: ";bold"
  },
  {
    key: "italic",
    label: "Italic",
    detail: "*text*",
    documentation: "Insert italic text",
    snippet: "*${1:text}*",
    sortOrder: "04",
    filterText: ";italic"
  },
  {
    key: "link",
    label: "Link",
    detail: "[text](url)",
    documentation: "Insert a link",
    snippet: "[${1:text}](${2:url})",
    sortOrder: "05",
    filterText: ";link"
  },
  {
    key: "image",
    label: "Image",
    detail: "![alt](url)",
    documentation: "Insert an image",
    snippet: "![${1:alt}](${2:url})",
    sortOrder: "06",
    filterText: ";image"
  },
  {
    key: "table3",
    label: "Table (3 cols)",
    detail: "| A | B | C |",
    documentation: "Insert a 3-column table",
    snippet: "| ${1:A} | ${2:B} | ${3:C} |\\n| --- | --- | --- |\\n| ${4:x} | ${5:y} | ${6:z} |",
    sortOrder: "07",
    filterText: ";table"
  },
  {
    key: "codeblock",
    label: "Code Block",
    detail: "```lang",
    documentation: "Insert a fenced code block",
    snippet: "```\n${1:code}\n```",
    sortOrder: "08",
    filterText: ";code"
  },
  {
    key: "blockquote",
    label: "Blockquote",
    detail: "> quote",
    documentation: "Insert a blockquote",
    snippet: "> ${1:quote}",
    sortOrder: "09",
    filterText: ";quote"
  },
  {
    key: "footnote",
    label: "Footnote",
    detail: "[^1]",
    documentation: "Insert a footnote",
    snippet: "${1:text}[^${2:1}]\\n\\n[^${2:1}]: ${3:note}",
    sortOrder: "10",
    filterText: ";footnote"
  },
  {
    key: "hr",
    label: "Horizontal Rule",
    detail: "---",
    documentation: "Insert a horizontal rule",
    snippet: "---",
    sortOrder: "11",
    filterText: ";hr"
  }
];
