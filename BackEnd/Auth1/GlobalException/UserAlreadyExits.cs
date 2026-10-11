namespace AuthLeave.GlobalException
{
    public class UserAlreadyExits :Exception
    {
        public UserAlreadyExits(string message) : base(message)
        {
        }
    }
}
