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

## Publicação no npm via tags do GitHub (GitHub Actions)

Sim — é possível publicar automaticamente no npm **a partir da criação de tags** no GitHub. Este repositório inclui um workflow que:

- roda testes + build
- lê a tag no formato `vX.Y.Z` (ex.: `v1.2.3`)
- ajusta a versão do `package.json` **apenas dentro do runner** (sem commit)
- publica no npm com `npm publish`

### Pré-requisitos

- Você precisa de um token do npm com permissão de publish.
  - Recomendado: **Automation token** (npm).
- No GitHub, criar um secret no repositório:
  - `NPM_TOKEN`: o token do npm.

### Como configurar (GitHub)

1. Vá em **Settings → Secrets and variables → Actions**
2. Crie **New repository secret**
3. Nome: `NPM_TOKEN`
4. Valor: seu token do npm

### Como publicar uma versão

Crie e envie uma tag no padrão `vX.Y.Z`:

```bash
git tag v1.2.3
git push origin v1.2.3
```

Isso dispara o workflow e publica `@tetri/semantic-versioning@1.2.3`.

### Notas importantes

- A versão publicada **vem da tag** (`v1.2.3` → `1.2.3`), não do valor fixo atual do `package.json`.
- Se você tentar publicar uma versão que já existe no npm, o `npm publish` falha (comportamento esperado).

## Licença

MIT (ver `LICENSE`).
