using academy.Modules.Multilingual.Entities;
using MediatR;

namespace academy.Modules.Multilingual.Features.CreateLanguage
{
    public record CreateLanguageCommand(string Code, string DisplayName, TextDirection Direction, bool IsDefault, bool IsActive) : IRequest<bool>;
}
