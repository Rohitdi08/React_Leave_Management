using LeaveSer.DB;
using LeaveSer.GlobalException;
using LeaveSer.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveSer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly LeaveDBContext _dbcontext;

        public LeaveController(LeaveDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        // POST /api/leave/apply
        [HttpPost("apply")]
        public IActionResult ApplyLeave(ApplyLeave apply)
        {
            var employeeId = GetEmployeeId();
            if (employeeId == null)
            {
                return Unauthorized("Employee id not found in token. Please login again.");
            }

            var fromDate = apply.FromDate.Date;
            var toDate = apply.ToDate.Date;

            if (toDate < fromDate)
            {
                throw new InvalidLeaveRequest("To date must be on or after From date.");
            }
            if (fromDate < DateTime.Today)
            {
                throw new InvalidLeaveRequest("Leave cannot be applied for past dates.");
            }

            var overlapping = _dbcontext.Leaves.Any(x =>
                x.EmployeeId == employeeId &&
                x.Status != LeaveStatus.Rejected &&
                x.FromDate <= toDate &&
                x.ToDate >= fromDate);
            if (overlapping)
            {
                throw new InvalidLeaveRequest("You already have a leave applied for these dates.");
            }

            var leave = new LeaveRequest
            {
                EmployeeId = employeeId.Value,
                LeaveType = apply.LeaveType,
                FromDate = fromDate,
                ToDate = toDate,
                Reason = apply.Reason,
                Status = LeaveStatus.Pending,
                AppliedDate = DateTime.Now
            };
            _dbcontext.Leaves.Add(leave);
            _dbcontext.SaveChanges();

            return Ok(new
            {
                Message = "Leave Applied Sucessfully",
                LeaveId = leave.LeaveId
            });
        }

        // GET /api/leave/my-leaves
        [HttpGet("my-leaves")]
        public IActionResult MyLeaves()
        {
            var employeeId = GetEmployeeId();
            if (employeeId == null)
            {
                return Unauthorized("Employee id not found in token. Please login again.");
            }

            var leaves = _dbcontext.Leaves
                .Where(x => x.EmployeeId == employeeId)
                .OrderByDescending(x => x.AppliedDate)
                .ToList();

            return Ok(leaves);
        }

        // GET /api/leave/pending
        [HttpGet("pending")]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult PendingLeaves()
        {
            var leaves = _dbcontext.Leaves
                .Where(x => x.Status == LeaveStatus.Pending)
                .OrderBy(x => x.AppliedDate)
                .ToList();

            return Ok(leaves);
        }

        // PUT /api/leave/approve/{id}
        [HttpPut("approve/{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult ApproveLeave(int id, LeaveAction? action)
        {
            var leave = UpdateStatus(id, LeaveStatus.Approved, action?.AdminRemark);
            return Ok(new
            {
                Message = "Leave Approved Sucessfully",
                Leave = leave
            });
        }

        // PUT /api/leave/reject/{id}
        [HttpPut("reject/{id:int}")]
        [Authorize(Policy = "AdminOnly")]
        public IActionResult RejectLeave(int id, LeaveAction? action)
        {
            if (string.IsNullOrWhiteSpace(action?.AdminRemark))
            {
                throw new InvalidLeaveRequest("Admin remark is required to reject a leave.");
            }

            var leave = UpdateStatus(id, LeaveStatus.Rejected, action.AdminRemark);
            return Ok(new
            {
                Message = "Leave Rejected Sucessfully",
                Leave = leave
            });
        }

        private LeaveRequest UpdateStatus(int id, string status, string? remark)
        {
            var leave = _dbcontext.Leaves.FirstOrDefault(x => x.LeaveId == id);
            if (leave == null)
            {
                throw new LeaveNotFound($"Leave not found with id: {id}");
            }
            if (leave.Status != LeaveStatus.Pending)
            {
                throw new InvalidLeaveRequest($"Leave is already {leave.Status}.");
            }

            leave.Status = status;
            leave.AdminRemark = remark;
            leave.ActionDate = DateTime.Now;
            _dbcontext.SaveChanges();

            return leave;
        }

        // UserID is added by Auth1 as the NameIdentifier claim
        private int? GetEmployeeId()
        {
            var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(value, out var id) ? id : null;
        }
    }
}
