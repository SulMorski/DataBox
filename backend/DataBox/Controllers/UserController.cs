using AutoMapper;
using AutoMapper.QueryableExtensions;
using DataBox.Data;
using DataBox.Dtos;
using DataBox.Models;
using DataBox.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DataBox.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public UserController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
            //pobranie wszystkich userów
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                                        .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                                        .ToListAsync();
            return Ok(users);
        }
            // pobieranie usera po id
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users
                                        .Where(u => u.Id == id)
                                        .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
                                        .FirstOrDefaultAsync();

            if (user == null)
                return NotFound();
            return Ok(user);
        }

        
        // faktyczny program

            // logowanie
        [HttpPost("login")]
        public async Task<ActionResult<int>> Login(LoginDto loginDto)
        {
            // funkcja hashująca
            var passwordHash = PasswordHasher.Hash(loginDto.Password);

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == loginDto.Email &&
                    u.PasswordHash == passwordHash);
            if (user == null)
                return Unauthorized(new { message = "niepoprawny login lub hasło" });

            user.LastOnline = DateTime.Now;
            await _context.SaveChangesAsync();

            var result = new
            {
                id = user.Id,
                username = user.Username
            };

            return Ok(result);
        }


            // rejestracja
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> PostUser(UserCreateDto newUser)
        {
            if (await _context.Users.AnyAsync(u => u.Email == newUser.Email))
                return Conflict("Email zajęty.");

            var user = _mapper.Map<User>(newUser);

            // funkcja hashująca
            user.PasswordHash = PasswordHasher.Hash(newUser.Password);

            user.Items = new List<Item>();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = _mapper.Map<UserDto>(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
        }

            // usuwanie usera na jakby co
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Items)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // pobieranie itemów usera
        [HttpGet("items/{userId}")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsByUser(int userId)
        {
            var items = await _context.Items
                .Where(i => i.UserId == userId)
                .Include(i => i.Tags)
                .OrderBy(i => i.Position)
                .ToListAsync();

            var itemDtos = _mapper.Map<List<ItemDto>>(items);

            return Ok(itemDtos);
        }

        // usuwanie konkretnego itemu usera
        [HttpDelete("items/{userId}/{itemId}")]
        public async Task<IActionResult> DeleteItem(int userId, int itemId)
        {
            // pobieramy użytkownika wraz z jego itemami
            var user = await _context.Users
                .Include(u => u.Items)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("Nie znaleziono użytkownika");

            // szukamy itemu w kolekcji użytkownika
            var item = user.Items.FirstOrDefault(i => i.Id == itemId);
            if (item == null)
                return NotFound("Nie znaleziono itemu");

            // usuwamy item
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

            //aktualizacja kolejności
        [HttpPut("items/{userId}/positions")]
        public async Task<IActionResult> UpdateItemPositions(
            int userId,
            [FromBody] List<ItemOrderDto> order)
        {
            if (order == null || order.Count == 0)
                return BadRequest("Brak danych");

            var itemIds = order.Select(o => o.Id).ToList();

            var items = await _context.Items
                .Where(i => i.UserId == userId && itemIds.Contains(i.Id))
                .ToListAsync();

            if (items.Count != order.Count)
                return BadRequest("Nieprawidłowe ID itemów");

            foreach (var item in items)
            {
                var newPosition = order.First(o => o.Id == item.Id).Position;
                item.Position = newPosition;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("tags")]
        public async Task<ActionResult<List<TagDto>>> GetAllTags()
        {
            var tags = await _context.Tags
                .OrderBy(t => t.Name)
                .ToListAsync();

            var tagsDto = _mapper.Map<List<TagDto>>(tags);

            return Ok(tagsDto);
        }
        [HttpPost("items/add")]
        public async Task<ActionResult<ItemDto>> AddItem([FromForm] ItemCreateDto newItem)
        {
            var user = await _context.Users
                .Include(u => u.Items)
                .FirstOrDefaultAsync(u => u.Id == newItem.UserId);
            if (user == null)
                return NotFound("Użytkownik nie istnieje.");

            var item = _mapper.Map<Item>(newItem);
            if (newItem.ImageFile != null)
            {
                using var ms = new MemoryStream();
                await newItem.ImageFile.CopyToAsync(ms);
                item.ImageData = ms.ToArray();
            }

            if (newItem.TagIds != null && newItem.TagIds.Any())
            {
                var tags = await _context.Tags
                    .Where(t => newItem.TagIds.Contains(t.Id))
                    .ToListAsync();
                item.Tags = tags;
            }

            var maxPosition = await _context.Items
                .Where(i => i.UserId == newItem.UserId)
                .MaxAsync(i => (int?)i.Position) ?? 0;
            item.Position = maxPosition + 1;

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            var itemDto = _mapper.Map<ItemDto>(item);

            return Ok();
        }
            //zrobienie favorite
        [HttpPatch("items/{id}/favorite")]
        public async Task<IActionResult> ToggleFavorite(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
                return NotFound();

            item.IsFavorite = !item.IsFavorite;
            item.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { item.Id, item.IsFavorite });
        }
        [HttpPut("items/update")]
        public async Task<ActionResult<ItemDto>> UpdateItem([FromForm] ItemUpdateDto updatedItem)
        {
            var item = await _context.Items
                .Include(i => i.Tags)
                .FirstOrDefaultAsync(i => i.Id == updatedItem.Id && i.UserId == updatedItem.UserId);
            if (item == null)
                return NotFound("Item nie istnieje lub nie należy do użytkownika.");

            item.Title = updatedItem.Title ?? item.Title;
            item.Content = updatedItem.Content ?? item.Content;
            item.Type = updatedItem.Type ?? item.Type;

            if (updatedItem.ImageFile != null)
            {
                using var ms = new MemoryStream();
                await updatedItem.ImageFile.CopyToAsync(ms);
                item.ImageData = ms.ToArray();
            }

            if (updatedItem.TagIds != null)
            {
                var tags = await _context.Tags
                    .Where(t => updatedItem.TagIds.Contains(t.Id))
                    .ToListAsync();
                item.Tags.Clear();
                (item.Tags as List<Tag>)?.AddRange(tags);
            }

            await _context.SaveChangesAsync();
            var itemDto = _mapper.Map<ItemDto>(item);

            return Ok(itemDto);
        }
    }
}
