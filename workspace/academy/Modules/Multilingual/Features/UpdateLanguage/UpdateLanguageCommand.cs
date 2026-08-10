using academy.Modules.Multilingual.Entities;
using MediatR;

namespace academy.Modules.Multilingual.Features.UpdateLanguage
{
    public record UpdateLanguageCommand(int Id, string Code, string DisplayName, TextDirection Direction, bool IsDefault, bool IsActive) : IRequest<bool>;
}
