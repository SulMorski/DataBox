namespace DataBox.Dtos
{
    public class ItemUpdateDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Type { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public IFormFile? ImageFile { get; set; }
        public List<int>? TagIds { get; set; }
    }
}
