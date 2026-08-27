package scheduler

import (
	"sort"

	"github.com/varun-66611/Calsync.AI/internal/domain"
)

type Planner struct{}

func NewPlanner() Planner {
	return Planner{}
}

func (p Planner) Prioritize(tasks []domain.Task) []domain.Task {
	sorted := make([]domain.Task, len(tasks))
	copy(sorted, tasks)

	sort.SliceStable(sorted, func(i, j int) bool {
		return sorted[i].Priority > sorted[j].Priority
	})

	return sorted
}
