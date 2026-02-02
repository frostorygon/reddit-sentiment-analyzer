---
description: Rigorous 8-phase decision loop for strategic decisions. Enforces research, monetization, marketing, security, critics, blind spots, cleanup, and revalidation until satisfied.
---

# Decision Framework Workflow

Invoke with `/decision-framework` before any significant technical or business decision.

## The Loop

### 1. Current Research (10 min max)
- Validate assumptions against live docs/market data
- Check for recent changes (API updates, competitor moves)

### 2. Monetization Optimization
- Quantify: $/unit, TAM, market rate comparison
- **ROI Analyst Attack**: "Is net profit worth the time investment?"

### 3. Marketing Considerations
- Distribution channels (organic vs. paid)
- SEO keywords frontloaded in titles/descriptions
- **Growth Hacker Attack**: "How will users discover this?"

### 4. Security Review
```bash
# Credential audit
grep -rn "API_KEY\|TOKEN\|SECRET" --include="*.js" --include="*.ts" --include="*.py" .
# Verify .gitignore coverage
cat .gitignore | grep -E "\.env|credentials|secret"
```
- All secrets external? (`~/.credentials/` or env vars)
- **Security Auditor Attack**: "What if this repo is public tomorrow?"

### 5. Critic Personas (pick 2+)
| Persona | Focus |
|---------|-------|
| **Pragmatist** | Execution realism |
| **Technical Realist** | Implementation difficulty |
| **ROI Analyst** | Net profit vs. time |
| **Stack Architect** | Technology bloat |
| **QA Engineer** | Edge cases, stability |
| **Business Strategist** | Competitive moat |
| **DevOps Engineer** | Deployment, CI/CD |
| **Execution Coach** | Decision paralysis |

Document each attack and your response.

### 6. Blind Spot Check
- "What have I NOT considered?"
- Edge cases? Competitor response? Maintenance burden? Legal/ToS?

### 7. Cleanup
- Remove deprecated code/thoughts
- Consolidate docs (single source of truth)

### 8. Revalidation Gate
- [ ] All critic attacks addressed?
- [ ] Security audit passed?
- [ ] Blind spots documented?

**If any checkbox is unchecked → Loop to Step 1**
**If all pass → Proceed to implementation**

---

## Quick Template

```markdown
## Decision: [Your Decision Here]

### Research
- [Finding 1]
- [Finding 2]

### Monetization
- Revenue model: [X]
- Market rate: [Y]

### Marketing
- Channels: [X, Y, Z]
- SEO: [Keywords]

### Security
- [ ] No secrets in code
- [ ] .gitignore verified

### Critics
1. **[Persona]**: "[Attack]" → **Response**: [Your rebuttal]
2. **[Persona]**: "[Attack]" → **Response**: [Your rebuttal]

### Blind Spots
- [Considered X]
- [Edge case Y]

### Decision
✅ PROCEED / ❌ PIVOT to [Alternative]
```
