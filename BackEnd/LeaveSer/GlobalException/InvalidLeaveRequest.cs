namespace LeaveSer.GlobalException
{
    public class InvalidLeaveRequest : Exception
    {
        public InvalidLeaveRequest(string message) : base(message)
        {
        }
    }
}
