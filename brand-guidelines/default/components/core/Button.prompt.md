The brand's action control: bold label, zero corner radius, no shadow.

```jsx
<Button variant="primary">Kontakt aufnehmen</Button>
<Button variant="outline" size="lg">Produkte</Button>
<Button variant="quiet" href="/de/referenzen/">Alle Referenzen</Button>
```

Hover darkens the fill (outline inverts to a blue fill); press nudges 1px down. On blue surfaces pass `onBlue` with `variant="outline"`. Never round the corners and never stack more than one red button per view.
