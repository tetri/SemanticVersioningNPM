# Semantic Versioning (npm)

Implementação de **Versionamento Semântico (SemVer 2.0.0)** em TypeScript com suporte a:

- parsing (string → objeto)
- comparação/ordenação (incluindo `prerelease`)
- serialização JSON (via `toJSON()` e `fromJSON()`)

## Instalação

```bash
npm i @tetri/semantic-versioning
```

## Uso rápido

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

const v = new SemanticVersion("1.2.3-alpha.1+build");

console.log(v.major, v.minor, v.patch); // 1 2 3
console.log(v.prerelease); // "alpha.1"
console.log(v.build); // "build"
console.log(v.toString()); // "1.2.3-alpha.1+build"
```

## API

### `new SemanticVersion(...)`

Formas suportadas:

- `new SemanticVersion()` → `0.0.0`
- `new SemanticVersion("1.2.3-alpha.1+build")`
- `new SemanticVersion(major, minor, patch, prerelease?, build?)`

Campos:

- `major`, `minor`, `patch` (números)
- `prerelease`, `build` (strings; vazias quando ausentes)

### Comparação

- `compareTo(other): number`
- `equals(other): boolean`
- `lt(other)`, `lte(other)`, `gt(other)`, `gte(other)`
- `SemanticVersion.compare(a, b): number`

Observações importantes do SemVer:

- `prerelease` **é menor** que a versão estável correspondente (ex.: `1.0.0-alpha < 1.0.0`)
- `build` **não participa** da ordenação (fica apenas em `toString()`/`toJSON()`)

### Parsing e JSON

- `SemanticVersion.parse(version: string): SemanticVersion`
- `toJSON(): string` (permite `JSON.stringify(new SemanticVersion("1.2.3"))` virar `"1.2.3"`)
- `SemanticVersion.fromJSON(json: string): SemanticVersion`

## Casos de uso

### Ordenar uma lista de versões

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

const versions = ["1.0.0", "1.0.0-alpha.2", "1.0.0-alpha.10", "0.9.9"]
  .map((s) => new SemanticVersion(s))
  .sort(SemanticVersion.compare);

console.log(versions.map(String));
// ["0.9.9","1.0.0-alpha.2","1.0.0-alpha.10","1.0.0"]
```

### Comparar com `prerelease`

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

const a = new SemanticVersion("1.0.0-alpha");
const b = new SemanticVersion("1.0.0");

console.log(a.lt(b)); // true
console.log(b.gt(a)); // true
```

### Tomar decisão de feature flag / compatibilidade

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

const minSupported = new SemanticVersion("2.3.0");
const current = new SemanticVersion("2.4.1");

if (current.gte(minSupported)) {
  // habilita feature / caminho novo
} else {
  // fallback
}
```

### Persistir em JSON e fazer round-trip

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

const original = new SemanticVersion("1.2.3-alpha.1+build");
const json = JSON.stringify({ version: original });
// json => {"version":"1.2.3-alpha.1+build"}

const parsed = JSON.parse(json) as { version: string };
const deserialized = new SemanticVersion(parsed.version);

console.log(deserialized.equals(original)); // true
```

Ou, se você já tem a string JSON do valor:

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

const v = SemanticVersion.fromJSON("\"1.2.3-alpha.1+build\"");
console.log(v.toString()); // "1.2.3-alpha.1+build"
```

### Validar entrada (tratando erros)

```ts
import { SemanticVersion } from "@tetri/semantic-versioning";

try {
  const v = new SemanticVersion("1.2"); // inválido
  console.log(v.toString());
} catch (err) {
  console.error("Versão inválida:", err);
}
```

## Publicação no npm (Trusted Publisher)

Este pacote usa **Trusted Publisher** do npm para publicação automática via GitHub Actions. O processo é totalmente automatizado e seguro.

### Como publicar uma nova versão

Use os scripts convenientes do `package.json`:

```bash
# Para versão patch (ex: 0.0.2 → 0.0.3)
npm run version:patch

# Para versão minor (ex: 0.0.2 → 0.1.0)
npm run version:minor

# Para versão major (ex: 0.0.2 → 1.0.0)
npm run version:major
```

**O que cada comando faz automaticamente:**

1. **Atualiza** `package.json` com a nova versão
2. **Cria commit** da mudança
3. **Cria tag** anotada (`v0.0.3`, etc.)
4. **Faz push** do commit e da tag para o GitHub

### O que acontece depois

O GitHub Actions detecta a nova tag e:

1. **Roda testes** e build
2. **Publica automaticamente** no npm via Trusted Publisher
3. **Gera provenance** para verificação de integridade

### Pré-requisitos (já configurados)

- ✅ **Trusted Publisher** habilitado no npm para este repositório
- ✅ **Workflow** `.github/workflows/publish.yml` configurado
- ✅ **Permissões OIDC** habilitadas no GitHub Actions

### Notas importantes

- O `package.json` **deve estar** com a versão correta antes de criar a tag
- Não publique versões que já existem no npm
- O processo é totalmente automático após rodar `npm run version:*`

## Licença

MIT (ver `LICENSE`).
