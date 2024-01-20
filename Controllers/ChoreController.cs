using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HouseRules.Data;
using HouseRules.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using HouseRules.Models;
using Microsoft.AspNetCore.Identity;

namespace HouseRules.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    // Get all chores
    public IActionResult Get()
    {
        return Ok(_dbContext
            .Chores
            .Include(b => b.ChoreAssignments)
            .ThenInclude(b => b.UserProfile)
            .Include(b => b.ChoreCompletion)
            .ThenInclude(cc => cc.UserProfile)
            .Select(c => new ChoreDTO
            {
                Id = c.Id,
                Name = c.Name,
                Difficulty = c.Difficulty,
                ChoreFrequencyDays = c.ChoreFrequencyDays,
                ChoreAssignments = c.ChoreAssignments
                .Select(ca => new ChoreAssignmentDTO
                {
                    Id = ca.Id,
                    UserProfileId = ca.UserProfileId,
                    ChoreId = ca.ChoreId
                })
                .ToList(),
                ChoreCompletion = c.ChoreCompletion
                .Select(ca => new ChoreCompletionDTO
                {
                    Id = ca.Id,
                    UserProfileId = ca.UserProfileId,
                    ChoreId = ca.ChoreId,
                    CompletedOn = ca.CompletedOn
                })
                .ToList()
               
            })
            .ToList());
    }

    // Get a chore by id
    [HttpGet("{id}")]
    // [Authorize]
    public IActionResult GetById(int id)
    {
        Chore chore = _dbContext
            .Chores
            .Include(b => b.ChoreAssignments)
            .ThenInclude(b => b.UserProfile)
            .Include(b => b.ChoreCompletion)
            .ThenInclude(cc => cc.UserProfile)
            .SingleOrDefault(b => b.Id == id);

        if (chore == null)
        {
            return NotFound();
        }

        return Ok(chore);
    }

    // Create a new chore
    [HttpPost]
    // [Authorize]
    public IActionResult CreateChore(Chore newChore)
    {
        _dbContext.Chores.Add(newChore);
        _dbContext.SaveChanges();
        return Created($"/api/chore/{newChore.Id}", newChore);
    }

    // Edit chore properties
    [HttpPut("{id}")]
    // [Authorize]
    public IActionResult UpdateChore(Chore chore, int id)
    {
        Chore choreToUpdate = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        if (choreToUpdate == null)
        {
            return NotFound();
        }
        else if (id != chore.Id)
        {
            return BadRequest();
        }
        choreToUpdate.Name = chore.Name;
        choreToUpdate.Difficulty = chore.Difficulty;
        choreToUpdate.ChoreFrequencyDays = chore.ChoreFrequencyDays;

        _dbContext.SaveChanges();

        return NoContent();
    }

    // Delete a chore
    [HttpDelete("{id}")]
    // [Authorize]
    public IActionResult DeleteChore(int id)
    {
        Chore choreToDelete = _dbContext.Chores.SingleOrDefault(c => c.Id == id);

        if (choreToDelete == null)
        {
            return NotFound();
        }

        _dbContext.Chores.Remove(choreToDelete);
        _dbContext.SaveChanges();

        return NoContent();
    }

// Assign a chore
[HttpPost("{id}/assign")]
// [Authorize]
public IActionResult AssignChore(int id, [FromQuery] int userId)
{
    _dbContext.ChoreAssignments.Add(new ChoreAssignment
    {
        UserProfileId = userId,
        ChoreId = id 
    });

    _dbContext.SaveChanges();

    return NoContent();
}

// Unassign a chore
[HttpPost("{id}/unassign")]
// [Authorize]
public IActionResult UnassignChore(int id, [FromQuery] int userId)
{
    // Find and remove the ChoreAssignment record
    var assignmentToRemove = _dbContext.ChoreAssignments
        .SingleOrDefault(ca => ca.ChoreId == id && ca.UserProfileId == userId);

    if (assignmentToRemove != null)
    {
        _dbContext.ChoreAssignments.Remove(assignmentToRemove);
        _dbContext.SaveChanges();
        return NoContent();
    }
    return NoContent();
}


// Complete a chore
[HttpPost("{id}/complete")]
public IActionResult Complete(int id, [FromQuery] int userId)
{
    // Retrieve the UserProfile and Chore entities based on their IDs
    var userProfile = _dbContext.UserProfiles.Find(userId);
    var chore = _dbContext.Chores.Find(id);

    // Check if both UserProfile and Chore entities exist
    if (userProfile == null || chore == null)
    {
        // Handle the case where either UserProfile or Chore does not exist
        return NotFound("UserProfile or Chore not found");
    }

    // Create a new ChoreCompletion entity and set properties
    var choreCompletion = new ChoreCompletion
    {
        UserProfileId = userId,
        UserProfile = userProfile,
        ChoreId = id,
        Chore = chore,
        CompletedOn = DateTime.Now
    };

    // Add the new ChoreCompletion entity to the context
    _dbContext.ChoreCompletions.Add(choreCompletion);

    // Save changes to the database
    _dbContext.SaveChanges();

    return NoContent();
}



}