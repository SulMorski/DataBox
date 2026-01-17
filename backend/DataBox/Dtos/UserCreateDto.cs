namespace DataBox.Dtos
{
    public record UserCreateDto(
        string Username,
        string Email,
        string Password
    );
}