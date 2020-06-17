[[.github/hero.svg]]

<div style="text-align: center">
# When can I travel again?
</div>

The travel industry is in shambles right now. Tourism has basically halted
globally and there's very little information available on when and how it'll
get started again. Despite the lack of opportunity, millions of people are just
_waiting_ to get back out there and start traveling again.

Information and (perhaps more importantly) authoritative recommendations
regarding travel has been basically non-existant. It's on us, the travellers,
to figure it out and keep ourselves informed.

This project is an attempt to start gathering information about travel,
tourism, and the politics surrounding it to make informed decisions and
recommendations to people who want to travel. I'm collecting as much
information as I can for each country and writing articles and recommendations
about how to think about travel. But I can't do it alone--I need your help!

## How does this thing work?

Think of this project as a sort of wiki. There's a markdown file for each
country in the [countries](countries) folder. As I collect information about
travel to a given country I update the markdown file with the relevant
information.

### The site

All the Markdown documents for the countries are compiled down to a website
that's published automatically whenever something changes in the repo. The site
is generated using [Gatsby](http://gatsbyjs.org/) and is hosted in AWS.o

To learn more about the site check out the [_site](_site) folder.

### Markdown format

Explaining the specifics of how Markdown works is a bit out of scope for this
little document but you can (learn how it works from the dude who invented
it)[https://daringfireball.net/projects/markdown/syntax]! That said, each
Markdown file has a little section at the top (called the frontmatter) that is
used for generating some cool stuff in the site.

Here's an example.

```markdown
---
code: ES
status: do_not_travel
timeline:
  borders_closed_at: '2020-03-22T00:00:00Z'
  borders_opened_at: '2020-07-01T00:00:00Z'
---

Spain is a beautiful country!
```

* `code` - This is the 2-letter ISO code for the country. This attribute is
  used by the site generator to match the document with a bunch of other
  country metadata.
* `status` - This is the general travel recommendation status based on our own
  analysis.
* `timeline` - This object contains a few key dates (namely `borders_closed_at`
  and `borders_opened_at`) to help auto-generate some recommendations and
  visualizations. I try to keep this as up to date as possible based on the
  information I find.

## Contributing

Obviously, I'd love help compiling information on each country. 

### Contributing content

* **Fork the repo.** You can make changes in your own fork.
* **Update the markdown.** Feel free to...basically write whatever! Sources are
  really helpful for the next part.
* **Open a pull request.** When you're done, open a PR with your changes and
  I'll take a look.

I'll do my best to keep the [contributors](CONTRIBUTORS.md) file up to date
when PRs are landed.

### Contributing other stuff

If you have a question, find something that's broken, or just think I'm a dummy
feel free to open an issue. I'm happy to have discussions in there. You can
find me on [twitter](https://twitter.com/iambradhe) too but I'm not very good
at twitter.

## FAQ

### Who are you?

I'm an engineer and entrepreneaur that loves to travel. I'm based in Portland,
Oregon (in the US) and I was actually planning on doing some extensive travel
in 2020. Thanks to COVID-19 I'm stuck inside so...this is the closest thing to
travel I can get.

### Why are you doing this?

I want everyone to be able to make informed decisions about travel and this is
an attempt to gather as much information as possible to inform those decisions.

I love to travel. I cannot _wait_ to travel again. I've been trying to study
the politics and consequences of travel in a COVID-19 (and even post-COVID-19)
world and this is a collection of my thoughts and recommendations with regard
to travel.

### How are you paying for this?

I'm trying to keep costs as low as possible (hence the choices in technology).
You can see the [way the infrastructure is
setup](_site/cloudformation/template.yaml) for more information on that.
