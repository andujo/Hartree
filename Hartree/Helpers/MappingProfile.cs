using AutoMapper;
using Model.Entities;
using Model.Dto;

namespace Helpers;
public class MappingProfile : Profile
{
	public MappingProfile()
	{  
		CreateMap<Cores, CoreDto>().ReverseMap();
	}
}
