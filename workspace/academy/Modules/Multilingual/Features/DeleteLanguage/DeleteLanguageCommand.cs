using MediatR;

namespace academy.Modules.Multilingual.Features.DeleteLanguage
{
    public record DeleteLanguageCommand(int Id) : IRequest<bool>;
}
