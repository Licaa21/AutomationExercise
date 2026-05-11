using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using AutomationExercise.API.Services;

namespace AutomationExercise.Tests.Services
{
    public class JwtServiceTests
    {
        private readonly IJwtService _jwtService;

        public JwtServiceTests()
        {
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "Jwt:Key", "super-secret-test-key-that-is-long-enough-32chars" },
                    { "Jwt:Issuer", "TestIssuer" },
                    { "Jwt:Audience", "TestAudience" }
                })
                .Build();

            _jwtService = new JwtService(config);
        }

        [Fact]
        public void CreateToken_ReturnsNonEmptyString()
        {
            var token = _jwtService.CreateToken("testuser");

            Assert.NotNull(token);
            Assert.NotEmpty(token);
        }

        [Fact]
        public void CreateToken_ContainsCorrectUsername()
        {
            var token = _jwtService.CreateToken("testuser");

            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            Assert.Contains(jwt.Claims, c => c.Value == "testuser");
        }

        [Fact]
        public void CreateToken_ExpiresInApproximatelyOneHour()
        {
            var before = DateTime.UtcNow;
            var token = _jwtService.CreateToken("testuser");

            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

            Assert.True(jwt.ValidTo > before.AddMinutes(59));
            Assert.True(jwt.ValidTo < before.AddMinutes(61));
        }

        [Fact]
        public void CreateToken_DifferentUsernames_ProduceDifferentTokens()
        {
            var token1 = _jwtService.CreateToken("alice");
            var token2 = _jwtService.CreateToken("bob");

            Assert.NotEqual(token1, token2);
        }

        [Fact]
        public void CreateToken_SameUsername_ProducesValidJwt()
        {
            var token = _jwtService.CreateToken("testuser");

            var canRead = new JwtSecurityTokenHandler().CanReadToken(token);

            Assert.True(canRead);
        }
    }
}
