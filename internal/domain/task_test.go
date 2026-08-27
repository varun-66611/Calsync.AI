package domain

import "testing"

func TestNewTask(t *testing.T) {
	t.Parallel()

	task, err := NewTask("  Plan workshop  ", PriorityMedium)
	if err != nil {
		t.Fatalf("expected task to be created, got error: %v", err)
	}

	if task.Title != "Plan workshop" {
		t.Fatalf("expected trimmed title, got %q", task.Title)
	}
}

func TestNewTask_Validation(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name     string
		title    string
		priority Priority
	}{
		{name: "empty title", title: " ", priority: PriorityLow},
		{name: "invalid priority", title: "Task", priority: Priority(99)},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			if _, err := NewTask(tc.title, tc.priority); err == nil {
				t.Fatalf("expected validation error for case %q", tc.name)
			}
		})
	}
}
