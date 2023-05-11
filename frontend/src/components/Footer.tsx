import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer id="footer" className="footer">
			<div className="container mx-auto sm:px-4">
			  <div className="flex flex-wrap  gy-4">
			    <div className="lg:w-2/5 pr-4 pl-4 md:w-full pr-4 pl-4 footer-info">
                    <Link to="" className="logo flex items-center">
                        <span>ScriptSlider</span>
                    </Link>
                    <p>Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.</p>
                    <div className="social-links flex mt-4">

                        {/* <Link href="#" className="twitter">
                            <FaTwitter />
                        </Link>
                        <Link href="#" className="facebook">
                            <FaFacebook />
                        </Link>
                        <Link href="#" className="instagram">
                            <FaInstagram />
                        </Link>
                        <Link href="#" className="linkedin">
                            <FaLinkedin/>
                        </Link> */}
                    </div>
			    </div>

                <div className="mt-8 w-full lg:w-3/5 flex flex-wrap">
                    <div className="lg:w-1/4 pr-4 pl-4 w-1/2 footer-links">
                        <h4>Useful Links</h4>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/">About us</Link>
                            </li>
                            <li>
                                <Link to="#">Privacy policy</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:w-1/4 pr-4 pl-4 w-1/2 footer-links">
                        <h4>Our Services</h4>
                        <ul>
                            <li>
                                <Link to="/script?action=create">Create Script</Link>
                            </li>
                            <li>
                                <Link to="/script">Scripts</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:w-1/2 pr-4 pl-4 w-full text-center md:text-start footer-contact">
                        <h4>Contact Us</h4>
                        <p>
                            U38 D25 <br/>
                            Astana, 010000<br/>
                            Kazakhstan <br/><br/>
                            <strong>Phone:</strong> +7 777 777 77 77<br/>
                            <strong>Email:</strong> admin@example.com<br/>
                        </p>
                    </div>

                </div>

			  </div>
			</div>

			<div className="container mx-auto sm:px-4 mt-4">
				<div className="copyright">
					&copy; Copyright <strong><span>ScriptSliderApp</span></strong>. All Rights Reserved
				</div>
			</div>
		</footer>
	);
}