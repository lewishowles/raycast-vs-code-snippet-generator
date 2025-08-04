import { Action, ActionPanel, Form, Toast, showToast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

interface SnippetFormValues {
	title: string;
	prefix: string;
	code: string;
};

export default function Command() {
	const { handleSubmit, itemProps } = useForm<SnippetFormValues>({
		onSubmit(formValues) {
			generateSnippet(formValues);

			showToast({
				style: Toast.Style.Success,
				title: "Snippet copied",
				message: "You can now paste it into the appropriate file.",
			});
		},
		validation: {
			title: value => {
				if (!value) {
					return "Please enter a snippet title";
				}
			},
			prefix: value => {
				if (!value) {
					return "Please enter a snippet prefix";
				}
			},
			code: value => {
				if (!value) {
					return "Please enter the code to convert";
				}
			},
		},
	});

	/**
	 * Generate our snippet from the provided form values, and copy the result
	 * to the clipboard.
	 *
	 * @param  {SnippetFormValues}  formValues",
	 *     The form values from which to generate the snippet.
	 */
	function generateSnippet(formValues: SnippetFormValues) {
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

		showToast({ title: "Snippet copied", message: "You can now paste it into the appropriate file." });
	}

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Generate Snippet" onSubmit={handleSubmit} />
				</ActionPanel>
			}
		>
			<Form.Description text="Enter your code snippet to convert it." />
			<Form.TextField title="Title" {...itemProps.title} />
			<Form.TextField title="Prefix" info="For multiple prefixes, please comma separate them." {...itemProps.prefix} />
			<Form.Separator />
			<Form.TextArea title="Code" {...itemProps.code} />
		</Form>
	);
}
