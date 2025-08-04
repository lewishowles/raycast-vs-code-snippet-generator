import { Form, ActionPanel, Action, showToast } from "@raycast/api";

type FormValues = {
	title: string;
	prefix: string;
	code: string;
};

export default function Command() {
	function generateSnippet(formValues: FormValues) {
		console.log(formValues);
		showToast({ title: "Snippet copied", message: "You can now paste it into the appropriate file." });

		let body = formValues.code;

		// Escape double quotes, unless they're already escaped.
		body = body.replace(/"/g, "\\\"");

		// Encode tabs
		body = body.replace(/\t/g, "\\t");

		// Wrap each line with a double quote, where it isn't already done.
		body = body.split("\n").map(line => `		"${line}",`).join("\n");

		// Define our prefixes, depending on if there are one or more.
		const prefixList = formValues.prefix.split(",").map(p => p.trim());
		const prefix = prefixList.length > 1 ? `[${prefixList.map(p => `"${p}"`).join(", ")}]` : `"${prefixList[0]}"`;

		const snippet = [
			`"${formValues.title}": {`,
			`	"prefix": ${prefix},`,
			"	\"body\": [",
			body,
			"	],",
			"},",
		].join("\n");

		console.log(snippet);
	}

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Generate Snippet" onSubmit={generateSnippet} />
				</ActionPanel>
			}
		>
			<Form.Description text="Enter your code snippet to convert it." />
			<Form.TextField id="title" title="Title" />
			<Form.TextField id="prefix" title="Prefix" info="For multiple prefixes, please comma separate them." />
			<Form.Separator />
			<Form.TextArea id="code" title="Code" />
		</Form>
	);
}
