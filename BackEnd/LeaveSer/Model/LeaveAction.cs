using System.ComponentModel.DataAnnotations;

namespace LeaveSer.Model
{
    // Body for approve / reject
    public class LeaveAction
    {
        [StringLength(500)]
        public string? AdminRemark { get; set; }
    }
}
