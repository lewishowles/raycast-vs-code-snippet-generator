# VS Code snippet generator

This extension simplifies the process of formatting code as required for a snippet by performing the necessary escaping and formatting automatically.

For example, the following code:

```html
<div>
	<label for="input">Input</label>
	<input type="text" id="input" />
</div>
```

And the following inputs:

- Title: Simple input
- Prefix: input, fi

Will produce the following output

```json
"Simple input": {
	"prefix": ["input", "fi"],
	"body": [
		"<div>",
		"\t<label for=\"input\">Input</label>",
		"\t<input type=\"text\" id=\"input\" />",
		"</div>",
	],
},
```
