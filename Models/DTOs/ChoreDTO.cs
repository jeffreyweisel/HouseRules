namespace HouseRules.Models.DTOs;

public class ChoreDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Difficulty { get; set; }
    public int ChoreFrequencyDays { get; set; }
    public List<ChoreAssignmentDTO>? ChoreAssignments { get; set; }
    public List<ChoreCompletionDTO>? ChoreCompletion { get; set; }
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