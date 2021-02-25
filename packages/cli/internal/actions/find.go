package actions

import (
	"strings"

	"github.com/manifoldco/promptui"
	"lookahead.web.app/cli/internal/logging"
	"lookahead.web.app/cli/internal/store"
	"lookahead.web.app/cli/internal/types"
)

//Find A monolithic function which spins up an interface which
//enables to search and find the desired todo/note.
func Find() types.DataSchema {
	todos, err := store.Store.GetAll()
	for i, todo := range todos {
		todo.LastEditedHuman = todo.ToLastEditedHuman()
		todos[i] = todo
	}
	if err != nil {
		logging.Error(1, "Some error happened: "+err.Error())
	}
	templates := &promptui.SelectTemplates{
		Label:    "{{ . }}",
		Active:   "-> {{ .Title | cyan }}",
		Inactive: "  {{ .Title }}",
		Selected: "-> {{ .Title | cyan }}",
		Details: `
--------- Details ----------
{{ "ID:" | faint }} {{ .Id }}
{{ .Title | cyan }}
{{ .Content }}
{{ "Last Edited: " | faint }} {{ .LastEditedHuman }}
`,
	}

	searcher := func(input string, index int) bool {
		todo := todos[index]
		title := strings.Replace(strings.ToLower(todo.Title), " ", "", -1)
		content := strings.Replace(strings.ToLower(todo.Title), " ", "", -1)
		input = strings.Replace(strings.ToLower(input), " ", "", -1)

		return strings.Contains(title, input) || strings.Contains(content, input)
	}

	selectedTodo := types.DataSchema{}

	prompt := promptui.Select{
		Label:     "Find todos/notes:",
		Items:     todos,
		Templates: templates,
		Size:      4,
		Searcher:  searcher,
	}

	i, _, err := prompt.Run()

	if err != nil {
		logging.Error(1, "Prompt failed %v\n", err)
		return selectedTodo
	}

	selectedTodo = todos[i]
	return selectedTodo
}
