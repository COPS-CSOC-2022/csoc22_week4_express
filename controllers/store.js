const book = require('../models/book.js')
const bookcopy= require('../models/bookCopy.js')


var getAllBooks = async(req, res) => {
    //TODO: access all books from the book model and render book list page
   
    // const newbook=new book({
    //     title: "African Folktales",
    //     genre:"westerns",
    //     author:"Lorem Ipsum",
    //     description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, dolorem!",
    //     rating:3,
    //     mrp:1000
    // })
    // await newbook.save()
    // const newbook1=new book({
    //     title: "African Folktales",
    //     genre:"thrillers",
    //     author:"Roger D. Abrahams",
    //     description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti.",
    //     rating:2,
    //     mrp:2000
    // })
    // await newbook1.save()
    // const newbook2=new book({
    //     title: "Oral Epics from Africa",
    //     genre:"poetry",
    //     author:"John William Johnson",
    //     description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur similique nulla ipsam.",
    //     rating:5,
    //     mrp:699
    // })
    // await newbook2.save()
    // const newbook3=new book({
    //     title: "Land Apart: A South African Reader",
    //     genre:"	horror",
    //     author:"J. M. Coetzee",
    //     description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, deleniti.",
    //     rating:4,
    //     mrp:420
    // })
    // await newbook3.save()
    // const newbook4=new book({
    //     title: "Love Child",
    //     genre:"Romance",
    //     author:"Baby Diana",
    //     description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur similique nulla ipsam.",
    //     rating:1,
    //     mrp:657
    // })
    // await newbook4.save()
    
    
    // const books=await book.find({})
    // books.forEach(async(book) => {
    //     for(let i=0;i<7;i++){
    //         const newcopy= new bookcopy({
    //             book: book._id,
    //             status:true,
    //         })
    //         await newcopy.save();
    //     }
    // })
    // const bookcop=await bookcopy.find({});
    // console.log(bookcop[0]);
    // const ji=await bookcop[0].populate("book").execPopulate();
    // console.log(bookcop[0].populated("book"));
    // console.log(ji);
    // const copies= await bookcopy.find({})
    // copies.forEach(async(copy)=>{
    //     const parent=await book.where("_id").equals(copy.book)
    //     parent[0].instances.push(copy._id);
    //     await parent[0].save()
    // })
    const allbook =await book.find({});
    res.render("book_list",{title: "Books", books:allbook});
}

var getBook = async(req, res) => {
    //TODO: access the book with a given id and render book detail page
    var cnt=0;
    const bookdetail=await book.where("_id").equals(req.params.id);
    var bookpopulated=await bookdetail[0].populate("instances").execPopulate();
    bookpopulated.instances.forEach((copy)=>{
        if(copy.status)
        cnt++;
    })
    res.render("book_detail",{book: bookdetail[0],num_available: cnt ,title :"BOOK"})
}

var getLoanedBooks = async(req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
    var in_loaned=await req.user.populate("loaned_books")
                             .execPopulate()
    var full_loaned=await in_loaned.populate("loaned_books.book")
                             .execPopulate();
    res.render("loaned_books",{books:full_loaned.loaned_books, title:"Loaned Books"})
}

var issueBook = async(req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    const bookdetail=await book.where("_id").equals(req.body.bid);
    var bookpopulated=await bookdetail[0].populate("instances").execPopulate();
    for (copy  of bookpopulated.instances){
        if(copy.status)
        {
            var book_instance=await bookcopy.where("_id").equals(copy._id);
            book_instance[0].status=false;
            book_instance[0].borrower=req.user._id;
            await book_instance[0].save();
            req.user.loaned_books.push(copy._id);
            await req.user.save();
            break; 
        }
    }
    res.redirect('/');
}

var searchBooks = async(req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    var result=[]
    const allbook =await book.find({});
    allbook.forEach(test => {
        if((test.title).includes(req.body.title))
        {
            if((test.genre).includes(req.body.genre))
            {
                if((test.author).includes(req.body.author))
                result.push(test)
                else
                return;
            }
            else
            return;
        }
        else
        return;
    })
    res.render("book_list",{title: "Books", books:result})
}

var returnBook =async (req, res) => {
      
    var book =await bookcopy.where("_id").equals(req.body.bid) 
    book[0].status=true;
    book[0].borrower=undefined;
    book[0].borrow_date=undefined;
    await book[0].save();
    var index = req.user.loaned_books.indexOf(req.body.bid);
    req.user.loaned_books.splice(index, 1);
    await req.user.save();
    res.redirect("/");
}


module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    returnBook,
    issueBook,
    searchBooks
}