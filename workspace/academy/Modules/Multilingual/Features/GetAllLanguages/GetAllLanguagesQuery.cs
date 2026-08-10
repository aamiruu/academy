using academy.Modules.Multilingual.Entities;
using MediatR;
using System.Collections.Generic;

namespace academy.Modules.Multilingual.Features.GetAllLanguages
{
    public record GetAllLanguagesQuery() : IRequest<IEnumerable<Language>>;
}
