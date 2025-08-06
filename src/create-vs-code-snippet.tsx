import { Action, ActionPanel, Clipboard, Form, Toast, showToast } from "@raycast/api";
import { useForm } from "@raycast/utils";

interface SnippetFormValues {
	title: string;
	prefix: string;
	code: string;
};

/**
 * Generate a VS Code snippet that can be pasted into a snippet file from a
 * block of code, title, and prefix.
 */
export default function Command() {
	const { handleSubmit, itemProps } = useForm<SnippetFormValues>({
		async onSubmit(formValues) {
			if (typeof formValues !== "object") {
				return;
			}

			const snippet = generateSnippet(formValues.title, formValues.prefix, formValues.code);

			await Clipboard.copy(snippet);

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
	 * @param  {string}  title
	 *     The title of the snippet.
	 * @param  {string}  prefix
	 *     The prefix for the snippet.
	 * @param  {string}  code
	 *     The code of the snippet.
	 */
	function generateSnippet(title: string, prefix: string, code: string) {
		if (!isNonEmptyString(code)) {
			return "";
		}

		if (!isNonEmptyString(title)) {
			title = "";
		}

		if (!isNonEmptyString(prefix)) {
			prefix = "";
		}

		title = title.trim();

		// The format of prefixes depends on whether there is one or more than
		// one.
		const prefixList = prefix.split(",").map(prefix => prefix.trim());

		prefix = prefixList.length > 1 ? `[${prefixList.map(prefix => `"${prefix}"`).join(", ")}]` : `"${prefixList[0]}"`;

		// Escape relevant characters in our code snippet.
		let body = code.replace(/"/g, "\\\"");
		body = body.replace(/\t/g, "\\t");
		body = body.split("\n").map(line => `\t\t"${line}",`).join("\n");

		return [
			`"${title}": {`,
			`	"prefix": ${prefix},`,
			"	\"body\": [",
			body,
			"	],",
			"},",
		].join("\n");
	}

	/**
	 * Determine if a given variable is a string, and non-empty.
	 *
	 * @param  {mixed}  variable
	 *     The variable to test.
	 */
	function isNonEmptyString(variable: unknown): variable is string {
		return typeof variable === "string" && variable !== "";
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
