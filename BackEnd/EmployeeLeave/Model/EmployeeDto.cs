namespace EmployeeLeave.Model
{
    // Response model - never expose Password outside the service
    public class EmployeeDto
    {
        public int UserID { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MobileNo { get; set; } = string.Empty;
        public int Department { get; set; }
        public int Role { get; set; }
        public int IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
