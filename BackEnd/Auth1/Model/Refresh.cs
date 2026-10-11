namespace AuthLeave.Model
{
    public class Refresh
    {
        public int Id { get; set; }

        public string Username { get; set; }
        public string Token { get; set; }
        public DateTime ExpireTime { get; set; }
    }
}
