using LeaveSer.GlobalException;

namespace LeaveSer.Middleware
{
    public class ExceptionHandling
    {
        private readonly RequestDelegate _next;

        public ExceptionHandling(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (LeaveNotFound ex)
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                await context.Response.WriteAsJsonAsync(new
                {
                    statusCode = context.Response.StatusCode,
                    message = ex.Message
                });
            }
            catch (InvalidLeaveRequest ex)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsJsonAsync(new
                {
                    statusCode = context.Response.StatusCode,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(new
                {
                    statusCode = context.Response.StatusCode,
                    message = "An unexpected error occurred.",
                    error = ex.Message
                });
            }
        }
    }
}
