package main

import (
	"fmt"
	"log"

	"github.com/varun-66611/Calsync.AI/internal/domain"
	"github.com/varun-66611/Calsync.AI/internal/scheduler"
)

func main() {
	tasks := []domain.Task{}
	for _, input := range []struct {
		title    string
		priority domain.Priority
	}{
		{title: "Follow up with client", priority: domain.PriorityHigh},
		{title: "Read research notes", priority: domain.PriorityLow},
		{title: "Prepare study plan", priority: domain.PriorityMedium},
	} {
		task, err := domain.NewTask(input.title, input.priority)
		if err != nil {
			log.Fatal(err)
		}
		tasks = append(tasks, task)
	}

	planner := scheduler.NewPlanner()
	prioritized := planner.Prioritize(tasks)

	fmt.Println("Prioritized agenda:")
	for i, task := range prioritized {
		fmt.Printf("%d. %s\n", i+1, task.Title)
	}
}
