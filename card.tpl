<div>
  <a
    href="{{ shortUrl }}"
    style="box-shadow: 0 0 5px 1px lightblue;
      border: 1px solid cornflowerblue;
      border-radius: 2px;
      color: initial;
      text-decoration: none;
      display: block;
      min-width: 350px;
      max-width: 600px;">
    <div
      style="background: #f5f5f5;
      padding: 10px;
      font-family: Helvetica;
      position: relative;">
      <input style="float: left;margin-right: 5px;" type="checkbox" disabled {{#if closed}}checked{{/if}}>
      <h4 style="margin: 0; font-weight: 300;">{{ name }}</h4>
      <p style="font-size: 12px;">{{ desc }}</p>
      <span
        style="position: absolute;
          bottom: 5px;
          right: 5px;
          font-size: 12px;
          color: #888;
          font-variant: small-caps;">
        trello</span>
    </div>
  </a>
</div>
