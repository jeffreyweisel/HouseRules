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
public class UserProfileController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public UserProfileController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    public IActionResult Get()
    {
        return Ok(_dbContext
            .UserProfiles
            .Include(up => up.IdentityUser)
            .Select(up => new UserProfileDTO
            {
                Id = up.Id,
                FirstName = up.FirstName,
                LastName = up.LastName,
                Address = up.Address,
                IdentityUserId = up.IdentityUserId,
                Email = up.IdentityUser.Email,
                UserName = up.IdentityUser.UserName
            })
            .ToList());
    }

    [HttpGet("withroles")]
    // [Authorize(Roles = "Admin")]
    public IActionResult GetWithRoles()
    {
        return Ok(_dbContext.UserProfiles
        .Include(up => up.IdentityUser)
        .Select(up => new UserProfileDTO
        {
            Id = up.Id,
            FirstName = up.FirstName,
            LastName = up.LastName,
            Address = up.Address,
            Email = up.IdentityUser.Email,
            UserName = up.IdentityUser.UserName,
            IdentityUserId = up.IdentityUserId,
            Roles = _dbContext.UserRoles
            .Where(ur => ur.UserId == up.IdentityUserId)
            .Select(ur => _dbContext.Roles.SingleOrDefault(r => r.Id == ur.RoleId).Name)
            .ToList()
        }));
    }

  [HttpGet("{id}")]
    // [Authorize]
    public IActionResult GetUserProfileById(int id)
    {
        UserProfile userProfile = _dbContext
          .UserProfiles
          .Include(p => p.IdentityUser)
          .Include(p => p.ChoreAssignments)
            .ThenInclude(ca => ca.Chore)
          .Include(p => p.ChoreCompletions)
            .ThenInclude(cc => cc.Chore)
          .SingleOrDefault(up => up.Id == id);

        if (userProfile == null)
        {
            return NotFound();
        }

        return Ok(new UserProfileDTO
        {
            Id = userProfile.Id,
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            Address = userProfile.Address,
            Email = userProfile.IdentityUser.Email,
            UserName = userProfile.IdentityUser.UserName,
            ChoreAssignments = userProfile.ChoreAssignments.Select(ca => new ChoreAssignmentDTO
            {
                Id = ca.Id,
                UserProfileId = ca.UserProfileId,
                ChoreId = ca.ChoreId,
                Chore = new ChoreDTO
                {
                    Id = ca.Chore.Id,
                    Name = ca.Chore.Name,
                    Difficulty = ca.Chore.Difficulty,
                    ChoreFrequencyDays = ca.Chore.ChoreFrequencyDays
                }
            }).ToList(),
            ChoreCompletions = userProfile.ChoreCompletions.Select(cc => new ChoreCompletionDTO
            {
                Id = cc.Id,
                UserProfileId = cc.UserProfileId,
                ChoreId = cc.ChoreId,
                CompletedOn = cc.CompletedOn,
                Chore = new ChoreDTO
                {
                    Id = cc.Chore.Id,
                    Name = cc.Chore.Name,
                    Difficulty = cc.Chore.Difficulty,
                    ChoreFrequencyDays = cc.Chore.ChoreFrequencyDays
                }
            }).ToList()
        });
    }

// [HttpGet("{id}")]
// // [Authorize]
// public IActionResult GetById(int id)
// {
//     UserProfile userProfile = _dbContext
//         .UserProfiles
//         .Include(b => b.ChoreAssignments)
//         .ThenInclude(ca => ca.Chore)
//         .Include(b => b.ChoreCompletions)
//         .ThenInclude(cc => cc.Chore)
//         .SingleOrDefault(b => b.Id == id);

//     if (userProfile == null)
//     {
//         return NotFound();
//     }

//     return Ok(userProfile);
// }

}


