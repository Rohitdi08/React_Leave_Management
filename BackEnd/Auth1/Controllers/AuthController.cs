using Auth1.DB;
using AuthLeave.GlobalException;
using AuthLeave.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Auth1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDBContext _dbcontext;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<EmployeeList> _passwordHasher = new();

        public AuthController(AuthDBContext dbcontext, IConfiguration configuration)
        {
            _dbcontext = dbcontext;
            _configuration = configuration;
        }

        [HttpPost("Register")]
        public IActionResult RegisterStud(EmployeeList lst1)
        {
            if (lst1 == null)
            {
                return BadRequest("Invalid request");
            }
            var Userexist = _dbcontext.Employees.Any(x => x.Email == lst1.Email);
            if (Userexist)
            {
                throw new UserAlreadyExits($"User name already exists: {lst1.Email}");
            }

            // Never store plain-text passwords
            lst1.Password = _passwordHasher.HashPassword(lst1, lst1.Password);
            lst1.CreatedDate = DateTime.UtcNow;

            _dbcontext.Employees.Add(lst1);
            _dbcontext.SaveChanges();
            return Ok(new
            {
                Message = "Registration Saved Sucessfully"
            });
        }

        [HttpPost("Login")]
        public IActionResult Login(Login lgn)
        {
            if (lgn == null || string.IsNullOrWhiteSpace(lgn.Uname) || string.IsNullOrWhiteSpace(lgn.Pass))
            {
                return BadRequest("Username and Password are required");
            }
            var valid = _dbcontext.Employees.FirstOrDefault(x => x.Email == lgn.Uname);
            if (valid == null ||
                _passwordHasher.VerifyHashedPassword(valid, valid.Password, lgn.Pass) == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid Username and Password");
            }

            var Accesstoken = GenerateAccessToken(valid.UserID, valid.Email, Convert.ToString(valid.Role), valid.Email);
            var RefreshToken = GenerateRefreshToken();

            // Keep only one active refresh token per user
            var oldTokens = _dbcontext.Refreshes.Where(x => x.Username == valid.Email);
            _dbcontext.Refreshes.RemoveRange(oldTokens);

            _dbcontext.Refreshes.Add(new Refresh
            {
                Username = valid.Email,
                Token = RefreshToken,
                ExpireTime = DateTime.UtcNow.AddDays(1)
            });
            _dbcontext.SaveChanges();

            return Ok(new
            {
                Accesstoken = Accesstoken,
                refreshtoken = RefreshToken,
                userRole = valid.Role
            });
        }

        private string GenerateAccessToken(int userId, string username, string role, string Email)
        {
            var claims = new[]
            {
               new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
               new Claim(ClaimTypes.Name, username),
               new Claim(ClaimTypes.Role, role),
               new Claim(ClaimTypes.Email, Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Guid.NewGuid().ToString();
        }

        [HttpPost("Refresh")]
        public IActionResult RefreshToken(RefreshToken refreshss)
        {
            if (refreshss == null)
            {
                return BadRequest("Invalid request");
            }
            var savedtoken = _dbcontext.Refreshes
                .FirstOrDefault(x => x.Username == refreshss.Username && x.Token == refreshss.Token);

            if (savedtoken == null)
            {
                return Unauthorized("Invalid Username or Token");
            }
            if (savedtoken.ExpireTime < DateTime.UtcNow)
            {
                return Unauthorized("Time is Expired");
            }

            // Take the role from the database, never from the client request
            var user = _dbcontext.Employees.FirstOrDefault(x => x.Email == savedtoken.Username);
            if (user == null)
            {
                return Unauthorized("Invalid Username");
            }

            var newAccessToken = GenerateAccessToken(user.UserID, user.Email, Convert.ToString(user.Role), user.Email);
            return Ok(new
            {
                Accesstoken = newAccessToken
            });
        }
    }
}
