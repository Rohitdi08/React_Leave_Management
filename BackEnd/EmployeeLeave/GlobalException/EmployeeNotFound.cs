namespace EmployeeLeave.GlobalException
{
    public class EmployeeNotFound : Exception
    {
        public EmployeeNotFound(string message) : base(message)
        {
        }
    }
}
