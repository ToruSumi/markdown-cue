export interface CompletionSnippet {
  key: string;
  label: string;
  detail?: string;
  documentation?: string;
  snippet: string;
  sortOrder: string;
  filterText: string;
  icon: string;
}

export const completionSnippets: ReadonlyArray<CompletionSnippet> = [
  {
    key: "heading1",
    label: "Heading 1",
    detail: "# text",
    documentation: "Insert an H1 heading",
    snippet: "# ${1:text}",
    sortOrder: "00",
    filterText: ";heading1",
    icon: "1️⃣"
  },
  {
    key: "heading2",
    label: "Heading 2",
    detail: "## text",
    documentation: "Insert an H2 heading",
    snippet: "## ${1:text}",
    sortOrder: "01",
    filterText: ";heading2",
    icon: "2️⃣"
  },
  {
    key: "heading3",
    label: "Heading 3",
    detail: "### text",
    documentation: "Insert an H3 heading",
    snippet: "### ${1:text}",
    sortOrder: "02",
    filterText: ";heading3",
    icon: "3️⃣"
  },
  {
    key: "bold",
    label: "Bold",
    detail: "**text**",
    documentation: "Insert bold text",
    snippet: "**${1:text}**",
    sortOrder: "03",
    filterText: ";bold",
    icon: "💪"
  },
  {
    key: "italic",
    label: "Italic",
    detail: "*text*",
    documentation: "Insert italic text",
    snippet: "*${1:text}*",
    sortOrder: "04",
    filterText: ";italic",
    icon: "✨"
  },
  {
    key: "link",
    label: "Link",
    detail: "[text](url)",
    documentation: "Insert a link",
    snippet: "[${1:text}](${2:url})",
    sortOrder: "05",
    filterText: ";link",
    icon: "🔗"
  },
  {
    key: "image",
    label: "Image",
    detail: "![alt](url)",
    documentation: "Insert an image",
    snippet: "![${1:alt}](${2:url})",
    sortOrder: "06",
    filterText: ";image",
    icon: "🖼️"
  },
  {
    key: "table3",
    label: "Table (3 cols)",
    detail: "| A | B | C |",
    documentation: "Insert a 3-column table",
    snippet: "| ${1:A} | ${2:B} | ${3:C} |\n| --- | --- | --- |\n| ${4:x} | ${5:y} | ${6:z} |",
    sortOrder: "07",
    filterText: ";table",
    icon: "📊"
  },
  {
    key: "codeblock",
    label: "Code Block",
    detail: "```lang",
    documentation: "Insert a fenced code block",
    snippet: "```\n${1:code}\n```",
    sortOrder: "08",
    filterText: ";code",
    icon: "💻"
  },
  {
    key: "blockquote",
    label: "Blockquote",
    detail: "> quote",
    documentation: "Insert a blockquote",
    snippet: "> ${1:quote}",
    sortOrder: "09",
    filterText: ";quote",
    icon: "💬"
  },
  {
    key: "footnote",
    label: "Footnote",
    detail: "[^1]",
    documentation: "Insert a footnote",
    snippet: "${1:text}[^${2:1}]\n\n[^${2:1}]: ${3:note}",
    sortOrder: "10",
    filterText: ";footnote",
    icon: "🔖"
  },
  {
    key: "hr",
    label: "Horizontal Rule",
    detail: "---",
    documentation: "Insert a horizontal rule",
    snippet: "---",
    sortOrder: "11",
    filterText: ";hr",
    icon: "➖"
  },
  {
    key: "strikethrough",
    label: "Strikethrough",
    detail: "~~text~~",
    documentation: "Insert strikethrough text",
    snippet: "~~${1:text}~~",
    sortOrder: "12",
    filterText: ";strike",
    icon: "🧵"
  },
  {
    key: "checkbox",
    label: "Checkbox",
    detail: "- [ ] text",
    documentation: "Insert an unchecked task item",
    snippet: "- [ ] ${1:text}",
    sortOrder: "13",
    filterText: ";check",
    icon: "☑️"
  },
  {
    key: "mathblock",
    label: "Math Block",
    detail: "$$ ... $$",
    documentation: "Insert a multiline math block",
    snippet: "$$\n${1:AA}\n$$",
    sortOrder: "14",
    filterText: ";math",
    icon: "∑"
  },
  {
    key: "underline",
    label: "Underline",
    detail: "<u>text</u>",
    documentation: "Insert underlined text",
    snippet: "<u>${1:text}</u>",
    sortOrder: "15",
    filterText: ";under",
    icon: "〰️"
  },
  {
    key: "details",
    label: "Details",
    detail: "<details>",
    documentation: "Insert a collapsible details block",
    snippet: "<details>\n<summary>${1:summary}</summary>\n${2:body}\n</details>",
    sortOrder: "16",
    filterText: ";details",
    icon: "📁"
  }
];
