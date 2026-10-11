using System.ComponentModel.DataAnnotations;

namespace EmployeeLeave.Model
{
    public class EmployeeList
    {
        [Key]
        public int UserID { get; set; }

        [Required(ErrorMessage = "Employee name is required.")]
        [StringLength(100, MinimumLength = 2,
            ErrorMessage = "Employee name must be between 2 and 100 characters.")]
        public string EmployeeName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mobile number is required.")]
        [RegularExpression(@"^[6-9]\d{9}$",
            ErrorMessage = "Please enter a valid 10-digit mobile number.")]
        public string MobileNo { get; set; }

        [Required(ErrorMessage = "Department is required.")]
        [Range(1, int.MaxValue,
            ErrorMessage = "Please select a valid department.")]
        public int Department { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6,
            ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }


        public int Role { get; set; }

        [Required]
        public int IsActive { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
