using System.ComponentModel.DataAnnotations;

namespace HouseRules.Models;

public class Chore
{
    public int Id { get; set; }
    [MaxLength(100, ErrorMessage = "Chore names must be 100 characters or less")]
    public string Name { get; set; }
    [Range(1, 5)]
    public int Difficulty { get; set; }
    [Range(1, 14)]
    public int ChoreFrequencyDays { get; set; }
    public List<ChoreAssignment>? ChoreAssignments { get; set; }
    public List<ChoreCompletion>? ChoreCompletion { get; set; }
     public int? DaysOverDue
    {
        get
        {
            if (ChoreAssignments != null && ChoreAssignments.Any() && ChoreCompletion != null && ChoreCompletion.Any())
            {
                DateTime latestCompletion = ChoreCompletion.Max(c => c.CompletedOn);

                // Calculate the days overdue by subtracting the frequency days from how long it has been since last completion
                int daysOverdue = ChoreFrequencyDays - (latestCompletion - DateTime.Now).Days;

                return daysOverdue;
            }
            else
            {
                return null;
            }
        }
    }
}