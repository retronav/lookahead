package util

import "testing"

func TestRFC3339ToUnix(t *testing.T) {
	type args struct {
		RFCDate string
	}
	tests := []struct {
		name string
		args args
		want int64
	}{
		{"29 January 2021; 7:58 pm", args{"2021-01-29T19:58:00Z"}, 1611950280},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := RFC3339ToUnix(tt.args.RFCDate); got != tt.want {
				t.Errorf("RFC3339ToUnix() = %v, want %v", got, tt.want)
			}
		})
	}
}
