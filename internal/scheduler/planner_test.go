package scheduler

import (
	"testing"

	"github.com/varun-66611/Calsync.AI/internal/domain"
)

func TestPrioritize(t *testing.T) {
	t.Parallel()

	tasks := []domain.Task{
		{Title: "Low", Priority: domain.PriorityLow},
		{Title: "High", Priority: domain.PriorityHigh},
		{Title: "Medium", Priority: domain.PriorityMedium},
	}

	result := NewPlanner().Prioritize(tasks)

	if result[0].Title != "High" || result[1].Title != "Medium" || result[2].Title != "Low" {
		t.Fatalf("unexpected order: %#v", result)
	}

	if tasks[0].Title != "Low" {
		t.Fatalf("expected original input to remain unchanged")
	}
}
