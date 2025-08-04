import { Form, ActionPanel, Action, showToast } from "@raycast/api";

type FormValues = {
	title: string;
	prefix: string;
	code: string;
};

export default function Command() {
	function generateSnippet(formValues: FormValues) {
		console.log(formValues);
		showToast({ title: "Submitted form", message: "See logs for submitted values" });
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
