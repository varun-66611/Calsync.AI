package domain

import (
	"errors"
	"strings"
)

type Priority int

const (
	PriorityLow Priority = iota
	PriorityMedium
	PriorityHigh
)

type Task struct {
	Title    string
	Priority Priority
}

func NewTask(title string, priority Priority) (Task, error) {
	if strings.TrimSpace(title) == "" {
		return Task{}, errors.New("title is required")
	}
	if priority < PriorityLow || priority > PriorityHigh {
		return Task{}, errors.New("priority is invalid")
	}
	return Task{
		Title:    strings.TrimSpace(title),
		Priority: priority,
	}, nil
}
