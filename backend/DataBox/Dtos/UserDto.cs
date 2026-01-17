namespace DataBox.Dtos
{
    public record UserDto(
        int Id,
        string Username,
        string Email,
        string PasswordHash
    );
}
