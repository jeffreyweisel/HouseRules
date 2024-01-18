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
            .Include(c => c.ChoreAssignments)
            .Include(c => c.ChoreCompletion)
            .Select(c => new ChoreDTO
            {
                Id = c.Id,
                Name = c.Name,
                Difficulty = c.Difficulty,
                ChoreFrequencyDays = c.ChoreFrequencyDays,
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
// [Authorize]
public IActionResult Complete(int id, [FromQuery] int userId)
{
    _dbContext.ChoreCompletions.Add(new ChoreCompletion
    {
        UserProfileId = userId,
        ChoreId = id,
        CompletedOn = DateTime.Now 
    });

    _dbContext.SaveChanges();

    return NoContent();
}


}