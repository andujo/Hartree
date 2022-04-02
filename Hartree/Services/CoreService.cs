using System.Threading.Tasks;
using AutoMapper;
using Model.Dto;

namespace Hartree.Services;
public interface ICoreService
{
	Task<CoreDto> GetCore(int id);
}

public class CoreService : ICoreService
{
    private readonly IMapper _mapper;

    public CoreService(IMapper mapper)
	{
        _mapper = mapper;
    }
	public async Task<CoreDto> GetCore(int id)
	{
		var core = new CoreDto();

		return _mapper.Map<CoreDto>(core);
	}
}