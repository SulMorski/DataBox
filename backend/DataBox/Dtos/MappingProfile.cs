using AutoMapper;
using DataBox.Models;

namespace DataBox.Dtos
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<Item, ItemDto>();
            CreateMap<UserCreateDto, User>();
            CreateMap<Tag, TagDto>();
            CreateMap<ItemCreateDto, Item>()
            .ForMember(dest => dest.ImageData, opt => opt.Ignore()) // plik obsłużymy ręcznie
            .ForMember(dest => dest.Tags, opt => opt.Ignore())      // tagi ręcznie
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.Now))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(_ => DateTime.Now));
            CreateMap<Item, ItemDto>()
            .ForMember(
                dest => dest.TagIds,
                opt => opt.MapFrom(src => src.Tags.Select(t => t.Id))
            );
        }

    }
}
